#!/usr/bin/env node
import ftp from 'basic-ftp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// 1. Load environment variables from .env.local if present
function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim()
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    })
  }
}

loadEnvLocal()

const FTP_HOST = process.env.FTP_HOST || 'ftp.ystoreza.co.za'
const FTP_USER = process.env.FTP_USER || 'admin@ystoreza.co.za'
const FTP_PASSWORD = process.env.FTP_PASSWORD || '@DmIn90!YsT@rE!'
const FTP_PORT = parseInt(process.env.FTP_PORT || '21', 10)
const FTP_SECURE = process.env.FTP_SECURE !== 'false'
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || '/'

const args = process.argv.slice(2)
const skipBuild = args.includes('--skip-build')

async function main() {
  console.log('====================================================')
  console.log('   🚀 YSTORE DIRECT-TO-DOMAIN FTP DEPLOYER')
  console.log('   Target: https://ystoreza.co.za/')
  console.log('====================================================\n')

  const publicDir = path.join(projectRoot, '.output', 'public')

  // 2. Build step (unless --skip-build is explicitly provided)
  if (!skipBuild || !fs.existsSync(publicDir)) {
    console.log('📦 Step 1/2: Generating static production bundle for root domain (baseURL = /)...')
    try {
      execSync('npx nuxt generate', {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          NUXT_APP_BASE_URL: '/'
        }
      })
      console.log('✅ Static generation complete (.output/public created)\n')
    } catch (err) {
      console.error('❌ Build failed. Aborting deployment.')
      process.exit(1)
    }
  } else {
    console.log('⏩ Step 1/2: Skipping build (--skip-build flag detected)\n')
  }

  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Output directory does not exist: ${publicDir}`)
    process.exit(1)
  }

  // Count files to upload
  let totalFiles = 0
  let totalBytes = 0
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else if (entry.isFile()) {
        totalFiles++
        totalBytes += fs.statSync(fullPath).size
      }
    }
  }
  walkDir(publicDir)

  console.log(`📡 Step 2/2: Connecting to FTP server (${FTP_HOST}:${FTP_PORT})...`)
  console.log(`👤 User: ${FTP_USER}`)
  console.log(`📂 Remote Path: ${FTP_REMOTE_DIR}`)
  console.log(`📊 Local Bundle: ${totalFiles} files (${(totalBytes / (1024 * 1024)).toFixed(2)} MB)\n`)

  const client = new ftp.Client(30000)
  client.ftp.verbose = false // Set to true if detailed FTP commands are needed

  // Progress tracking
  let transferredBytes = 0
  let lastReportedPct = -1
  client.trackProgress(info => {
    transferredBytes += info.bytes
    const pct = Math.min(100, Math.round((transferredBytes / totalBytes) * 100))
    if (pct !== lastReportedPct && pct % 10 === 0) {
      process.stdout.write(`⏳ Upload progress: ${pct}% (${(transferredBytes / (1024 * 1024)).toFixed(2)} MB)...\r`)
      lastReportedPct = pct
    }
  })

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port: FTP_PORT,
      secure: FTP_SECURE,
      secureOptions: { rejectUnauthorized: false }
    })

    console.log('🔒 Encrypted TLS session established successfully.')
    console.log(`Uploading files to ${FTP_REMOTE_DIR}...`)

    await client.ensureDir(FTP_REMOTE_DIR)
    await client.uploadFromDir(publicDir, FTP_REMOTE_DIR)

    console.log('\n\n====================================================')
    console.log('🎉 DEPLOYMENT COMPLETE!')
    console.log('   All files uploaded to ystoreza.co.za')
    console.log(`   Total transferred: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB across ${totalFiles} files`)
    console.log('   🌐 Live URL: https://ystoreza.co.za/')
    console.log('====================================================')
  } catch (err) {
    console.error('\n❌ FTP transfer failed:', err.message)
    process.exit(1)
  } finally {
    client.close()
  }
}

main()


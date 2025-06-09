# Test Inactivity Timer Functionality
# This script helps test that the inactivity timer is working correctly

Write-Host "=== Inactivity Timer Test Script ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"

# Function to check inactivity timer status
function Test-InactivityTimers {
    try {
        Write-Host "Checking inactivity timer status..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/api/debug/inactivity-timers" -Method GET
        
        Write-Host "✅ API Response:" -ForegroundColor Green
        Write-Host "Total Active Scenarios: $($response.totalActiveScenarios)" -ForegroundColor Cyan
        Write-Host "Total Active Timers: $($response.totalActiveTimers)" -ForegroundColor Cyan
        Write-Host ""
        
        if ($response.scenarios -and $response.scenarios.Count -gt 0) {
            Write-Host "📊 Scenario Details:" -ForegroundColor Yellow
            foreach ($scenario in $response.scenarios) {
                Write-Host "  User: $($scenario.userEmail)" -ForegroundColor White
                Write-Host "  Status: $($scenario.scenarioStatus)" -ForegroundColor White
                Write-Host "  Has Timer: $($scenario.hasInactivityTimer)" -ForegroundColor $(if ($scenario.hasInactivityTimer) { "Green" } else { "Red" })
                Write-Host "  Timeout: $($scenario.timeoutSeconds)s" -ForegroundColor White
                Write-Host ""
            }
        } else {
            Write-Host "📝 No active scenarios found" -ForegroundColor Gray
        }
        
        return $true    }
    catch {
        Write-Host "❌ Error checking inactivity timers: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to check general debug info
function Test-GeneralDebug {
    try {
        Write-Host "Checking general debug info..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/api/debug" -Method GET
        
        Write-Host "✅ General Debug Response:" -ForegroundColor Green
        Write-Host "Active Scenarios: $($response.activeScenariosCount)" -ForegroundColor Cyan
        Write-Host "Active Channels: $($response.activeChannelsCount)" -ForegroundColor Cyan
        
        return $true    }
    catch {
        Write-Host "❌ Error checking general debug: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main test execution
Write-Host "🔍 Testing server connectivity..." -ForegroundColor Yellow

try {
    # Test if server is running
    $response = Invoke-WebRequest -Uri "$baseUrl/api/debug" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host ""
    
    # Run tests
    $generalOk = Test-GeneralDebug
    Write-Host ""
    $timersOk = Test-InactivityTimers
    
    Write-Host ""
    Write-Host "=== Test Summary ===" -ForegroundColor Green
    Write-Host "General Debug: $(if ($generalOk) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($generalOk) { "Green" } else { "Red" })
    Write-Host "Timer Debug: $(if ($timersOk) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($timersOk) { "Green" } else { "Red" })
    
    Write-Host ""
    Write-Host "📋 Instructions:" -ForegroundColor Yellow
    Write-Host "1. Start a scenario in the web UI" -ForegroundColor White
    Write-Host "2. Send a message in the drill channels" -ForegroundColor White
    Write-Host "3. Wait 20+ seconds without sending another message" -ForegroundColor White
    Write-Host "4. Check if bots automatically send follow-up messages" -ForegroundColor White
    Write-Host "5. Re-run this script to monitor timer status" -ForegroundColor White
    
} catch {
    Write-Host "❌ Server is not running or not accessible at $baseUrl" -ForegroundColor Red
    Write-Host "Make sure to start the backend server with: npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

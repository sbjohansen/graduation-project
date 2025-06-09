# Test Inactivity Timer Functionality
Write-Host "=== Inactivity Timer Test Script ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"

Write-Host "🔍 Testing server connectivity..." -ForegroundColor Yellow

try {
    # Test if server is running
    $response = Invoke-WebRequest -Uri "$baseUrl/api/debug" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host ""
    
    # Check general debug info
    Write-Host "Checking general debug info..." -ForegroundColor Yellow
    $debugResponse = Invoke-RestMethod -Uri "$baseUrl/api/debug" -Method GET
    Write-Host "✅ General Debug Response:" -ForegroundColor Green
    Write-Host "Active Scenarios: $($debugResponse.activeScenariosCount)" -ForegroundColor Cyan
    Write-Host "Active Channels: $($debugResponse.activeChannelsCount)" -ForegroundColor Cyan
    Write-Host ""
    
    # Check inactivity timer status
    Write-Host "Checking inactivity timer status..." -ForegroundColor Yellow
    $timerResponse = Invoke-RestMethod -Uri "$baseUrl/api/debug/inactivity-timers" -Method GET
    
    Write-Host "✅ Timer API Response:" -ForegroundColor Green
    Write-Host "Total Active Scenarios: $($timerResponse.totalActiveScenarios)" -ForegroundColor Cyan
    Write-Host "Total Active Timers: $($timerResponse.totalActiveTimers)" -ForegroundColor Cyan
    Write-Host ""
    
    if ($timerResponse.scenarios -and $timerResponse.scenarios.Count -gt 0) {
        Write-Host "📊 Scenario Details:" -ForegroundColor Yellow
        foreach ($scenario in $timerResponse.scenarios) {
            Write-Host "  User: $($scenario.userEmail)" -ForegroundColor White
            Write-Host "  Status: $($scenario.scenarioStatus)" -ForegroundColor White
            if ($scenario.hasInactivityTimer) {
                Write-Host "  Has Timer: $($scenario.hasInactivityTimer)" -ForegroundColor Green
            } else {
                Write-Host "  Has Timer: $($scenario.hasInactivityTimer)" -ForegroundColor Red
            }
            Write-Host "  Timeout: $($scenario.timeoutSeconds)s" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Host "📝 No active scenarios found" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "=== Test Summary ===" -ForegroundColor Green
    Write-Host "Server: ✅ PASS" -ForegroundColor Green
    Write-Host "Debug API: ✅ PASS" -ForegroundColor Green
    Write-Host "Timer API: ✅ PASS" -ForegroundColor Green
    
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
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null

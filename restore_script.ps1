try {
    $currentPath = "src/saas/views/angle-view.component.html"
    $restoredPath = "restored_view.html"
    $outputPath = "src/saas/views/angle-view.component.html"

    $c = Get-Content $currentPath
    $r = Get-Content $restoredPath
    
    $final = @()
    
    # 1. Header (Current) 
    # Use indices 0..128 to match up to the end of the "Standard View" block
    # Check what line 129 is in Current.
    # We want to stop BEFORE the first tool block starts.
    # In Current, line 130 is "} @else if (activeToolId() === 'microsite') {"
    $final += $c[0..128]
    
    # 2. Restored Body (All Tools + Footer)
    # Start at Index 129 (Line 130: "} @else if...")
    # This includes Microsite, Prompts, Audit, Booklet, Footer.
    # We take everything til the end.
    
    # FIX: Check for the double brace at line 672 in source
    # Line 672 in $r is "    }". Line 673 is "    } @else if ...".
    # This IS valid if previous block was nested. 
    # BUT my previous "correction" removed it.
    # I will TRUST the Git version $r blindly this time, assuming 26f45b5 was valid.
    # If the build fails, it might be due to mismatched context with the Header?
    
    $final += $r[129..($r.Count - 1)]
    
    $final | Set-Content $outputPath -Encoding UTF8
    Write-Host "Restoration complete. Lines: $($final.Count)"
}
catch {
    Write-Error $_
}

// PUBG Mobile Request Delayer - 200ms
(async () => {
    const DELAY = 200;
    
    // All PUBG domains
    const PUBG_DOMAINS = [
        // Basic
        'proximabeta.com',
        'pgimx.com',
        'pubg.com',
        'tencentgames.com',
        
        // From your screenshot
        'tiktokcdn.com',
        'amsoveasea.com',
        'vasdgame.com',
        'igamecj.com',
        'gpubgm.com',
        'tdatamaster.com',
        'gjacky.com',
        'app-measurement.com',
        
        // Additional
        'krafton.com',
        'battlegroundsmobile.com',
        'pubgmobile.com',
        
        // CDNs
        'akamai.net',
        'cloudfront.net',
        'amazonaws.com'
    ];
    
    if (typeof $request !== 'undefined') {
        const url = $request.url || '';
        const hostname = getHostname(url);
        const method = $request.method || 'GET';
        
        // Check if PUBG request
        const isPUBG = PUBG_DOMAINS.some(domain => {
            return hostname.includes(domain) || 
                   hostname.endsWith('.' + domain);
        });
        
        if (isPUBG) {
            console.log(`[PUBG] Delaying ${method} request`);
            console.log(`Host: ${hostname}`);
            console.log(`Applying ${DELAY}ms delay...`);
            
            // Update counter
            let counter = parseInt($persistentStore.read("pubg_counter") || "0");
            counter++;
            $persistentStore.write(counter.toString(), "pubg_counter");
            
            // Save last domain
            $persistentStore.write(hostname, "last_pubg_domain");
            
            // Apply delay
            await new Promise(resolve => setTimeout(resolve, DELAY));
            
            console.log(`Delayed ${counter} PUBG requests total`);
            console.log(`Last domain: ${hostname}`);
        }
        
        $done({ request: $request });
    }
    
    // Helper function
    function getHostname(url) {
        try {
            return new URL(url).hostname.toLowerCase();
        } catch (e) {
            const match = url.match(/^(?:https?:\/\/)?([^\/?#]+)/i);
            return match ? match[1].toLowerCase() : '';
        }
    }
})();

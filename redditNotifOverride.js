// ==UserScript==
// @name        RedditNotifOverride
// @namespace   Test
// @description Overrides the default notification service worker with a custom one that sends post requests to localhost
// @version     2
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @include https://reddit.com/*
// @include https://www.reddit.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

class ServiceOverride {
    constructor(worker) {
        this.worker = worker;
    }

    log = (text) => {
        console.log(`TAMPERMONKEY::WILLOWINJECT -> ${text}`);
    }

    run = () => {
        this.log(`Running app with new worker ${this.worker}`);
        this.log(`Worker status: ${this.worker.active}`);
        this.worker.addEventListener('push', (event) => {
          if (!(self.Notification && self.Notification.permission === 'granted')) {
            return;
          }

          const data = event.data?.json() ?? {};
          console.log(`Supposed new push event with data ${data}`);
        });
    }
}

var override = null;
var hasRun = false;
window.addEventListener('beforescriptexecute', function(e) {
     console.log("TAMPERMONKEY::WILLOWINJECT -> injected code successfully!!!");
     navigator.serviceWorker.getRegistrations().then(function(registrations) {
     let method = registrations.find(x => x.scope === "https://www.reddit.com/");
     console.log("TAMPERMONKEY::WILLOWINJECT -> SERVICE WORKER FOUND!");
     console.log(method.scope);
     console.log(method);
     override = new ServiceOverride(method);
     override.run();
    })
});

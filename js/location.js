/* =====================================================
   AHD LIVE LOCATION SYSTEM (js/location.js)
   Instantly requests geolocation on page load,
   reverse-geocodes via OpenStreetMap Nominatim,
   updates all location tags across the page, and
   notifies product components (home.js, search.js)
   to show live nearby products for the detected city.
===================================================== */

const AHDLocation = {
    current: {
        city: "Agra",
        state: "Uttar Pradesh",
        formatted: "Agra, Uttar Pradesh",
        latitude: null,
        longitude: null,
        isLive: false
    },

    listeners: [],

    onUpdate(fn) {
        if (typeof fn === "function") {
            this.listeners.push(fn);
            if (this.current.latitude || this.current.city) {
                fn(this.current);
            }
        }
    },

    broadcast() {
        this.updateDOMElements();
        window.AHD_CURRENT_LOCATION = this.current;
        window.dispatchEvent(new CustomEvent("ahd:location-updated", { detail: this.current }));
        this.listeners.forEach(fn => {
            try { fn(this.current); } catch (e) { console.error("Location listener error:", e); }
        });
    },

    updateDOMElements() {
        const text = this.current.formatted;
        document.querySelectorAll("[data-location], #userLocation").forEach(el => {
            el.textContent = text;
        });

        // Add/remove live pulsing indicator on location-box
        document.querySelectorAll(".location-box, .location").forEach(box => {
            let dot = box.querySelector(".live-dot");
            if (this.current.isLive) {
                if (!dot) {
                    dot = document.createElement("span");
                    dot.className = "live-dot";
                    box.prepend(dot);
                }
            }
        });
    },

    async reverseGeocode(lat, lon) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                {
                    headers: { 'User-Agent': 'AHDMarketplace/1.0' },
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && data.address) {
                    const addr = data.address;
                    const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.county || "Agra";
                    const state = addr.state || "Uttar Pradesh";
                    return { city, state };
                }
            }
        } catch (err) {
            console.warn("Reverse geocode error or timeout, using fallback:", err);
        }

        return { city: "Agra", state: "Uttar Pradesh" };
    },

    requestLiveLocation() {
        document.querySelectorAll("[data-location], #userLocation").forEach(el => {
            el.textContent = "Detecting location...";
        });

        if (!navigator.geolocation) {
            console.warn("Geolocation not supported by this browser.");
            this.current.formatted = "Agra, Uttar Pradesh";
            this.broadcast();
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                this.current.latitude = lat;
                this.current.longitude = lon;
                this.current.isLive = true;

                // Reverse geocode to get real city name
                const { city, state } = await this.reverseGeocode(lat, lon);
                this.current.city = city;
                this.current.state = state;
                this.current.formatted = `${city}, ${state}`;

                this.broadcast();
            },
            (error) => {
                console.warn("Geolocation permission note:", error.message);
                // Graceful fallback
                this.current.isLive = false;
                this.current.city = "Agra";
                this.current.state = "Uttar Pradesh";
                this.current.formatted = "Agra, Uttar Pradesh";
                this.broadcast();
            },
            options
        );
    },

    promptChangeLocation() {
        const input = prompt("Enter your City or District name (e.g. Agra, Delhi, Mathura, Jaipur, Noida):", this.current.city);
        if (input && input.trim()) {
            const clean = input.trim();
            this.current.city = clean;
            this.current.formatted = `${clean}, Uttar Pradesh`;
            this.current.isLive = true;
            this.broadcast();
        }
    }
};

window.AHDLocation = AHDLocation;
window.requestLocation = () => AHDLocation.requestLiveLocation();

// Request location as soon as script runs or DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AHDLocation.requestLiveLocation());
} else {
    AHDLocation.requestLiveLocation();
}
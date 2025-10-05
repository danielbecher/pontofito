export async function getPublicIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        return ip;
    } catch {
        return "unknown";
    }
}

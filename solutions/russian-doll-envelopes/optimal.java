class Solution {
    public int maxEnvelopes(int[][] envelopes) {
        Arrays.sort(envelopes, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);   // w ↑, h ↓
        int[] tails = new int[envelopes.length];
        int len = 0;
        for (int[] e : envelopes) {                         // LIS on heights
            int lo = 0, hi = len;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < e[1]) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = e[1];
            if (lo == len) len++;
        }
        return len;
    }
}

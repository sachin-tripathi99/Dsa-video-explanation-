class Solution {
    public int splitArray(int[] nums, int k) {
        long lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }   // [largest element, total]
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (parts(nums, mid) <= k) hi = mid;                // cap achievable
            else lo = mid + 1;
        }
        return (int) lo;
    }

    private int parts(int[] a, long cap) {                      // greedy: new part when the next number overflows
        int p = 1;
        long s = 0;
        for (int x : a) {
            if (s + x > cap) { p++; s = 0; }
            s += x;
        }
        return p;
    }
}

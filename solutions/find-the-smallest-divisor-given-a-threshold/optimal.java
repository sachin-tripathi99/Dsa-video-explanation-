class Solution {
    public int smallestDivisor(int[] nums, int threshold) {
        int lo = 1, hi = 0;
        for (int x : nums) hi = Math.max(hi, x);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long s = 0;
            for (int x : nums) s += (x + mid - 1) / mid;    // ceil(x / mid)
            if (s <= threshold) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}

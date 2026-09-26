class Solution {
    public int smallestDivisor(int[] nums, int threshold) {
        for (int d = 1; ; d++) {
            long s = 0;
            for (int x : nums) s += (x + d - 1) / d;
            if (s <= threshold) return d;
        }
    }
}

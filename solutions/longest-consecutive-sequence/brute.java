class Solution {
    private boolean contains(int[] a, long x) {
        for (int v : a) if (v == x) return true;      // linear scan
        return false;
    }

    public int longestConsecutive(int[] nums) {
        int best = 0;
        for (int x : nums) {
            int length = 1;
            while (contains(nums, (long) x + length)) length++;
            best = Math.max(best, length);
        }
        return best;
    }
}

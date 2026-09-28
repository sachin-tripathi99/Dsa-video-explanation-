class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];                 // smallest tail per length
        int len = 0;
        for (int x : nums) {
            int lo = 0, hi = len;
            while (lo < hi) {                               // first tail ≥ x
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == len) len++;
        }
        return len;
    }
}

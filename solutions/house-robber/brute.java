class Solution {
    public int rob(int[] nums) {
        return best(nums, nums.length - 1);
    }

    private int best(int[] a, int i) {                      // most money from houses 0..i
        if (i < 0) return 0;
        return Math.max(best(a, i - 1), best(a, i - 2) + a[i]);   // skip or rob house i
    }
}

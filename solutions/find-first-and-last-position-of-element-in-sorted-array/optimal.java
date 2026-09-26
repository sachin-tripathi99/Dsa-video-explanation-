class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lowerBound(nums, target);
        if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
        return new int[]{first, lowerBound(nums, target + 1) - 1};
    }

    private int lowerBound(int[] a, int t) {          // first index with a[i] >= t
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= t) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}

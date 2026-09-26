class Solution {
    public int search(int[] nums, int target) {
        int n = nums.length, lo = 0, hi = n - 1;
        while (lo < hi) {                               // index of the minimum
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
        }
        int k = lo;
        if (target >= nums[k] && target <= nums[n - 1]) return find(nums, k, n - 1, target);
        return find(nums, 0, k - 1, target);
    }

    private int find(int[] a, int lo, int hi, int t) {
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == t) return mid;
            if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }
}

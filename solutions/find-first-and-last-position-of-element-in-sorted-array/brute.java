class Solution {
    public int[] searchRange(int[] nums, int target) {
        int i = Arrays.binarySearch(nums, target);
        if (i < 0) return new int[]{-1, -1};
        int l = i, r = i;
        while (l > 0 && nums[l - 1] == target) l--;
        while (r < nums.length - 1 && nums[r + 1] == target) r++;
        return new int[]{l, r};
    }
}

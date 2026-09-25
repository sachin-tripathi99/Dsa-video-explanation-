class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(nums[a], nums[b]));  // sort indices by value
        int l = 0, r = n - 1;
        while (l < r) {
            long s = (long) nums[idx[l]] + nums[idx[r]];
            if (s == target) return new int[]{idx[l], idx[r]};
            if (s < target) l++;
            else r--;
        }
        return new int[0];
    }
}

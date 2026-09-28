class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        if (nums.length == 0) return null;
        int m = nums.length / 2;
        TreeNode root = new TreeNode(nums[m]);
        root.left = sortedArrayToBST(Arrays.copyOfRange(nums, 0, m));                // copies
        root.right = sortedArrayToBST(Arrays.copyOfRange(nums, m + 1, nums.length));
        return root;
    }
}

class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] a, int lo, int hi) {
        if (lo > hi) return null;
        int m = (lo + hi) >>> 1;                            // middle of the range = root
        TreeNode root = new TreeNode(a[m]);
        root.left = build(a, lo, m - 1);
        root.right = build(a, m + 1, hi);
        return root;
    }
}

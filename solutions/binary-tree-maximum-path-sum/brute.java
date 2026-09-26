class Solution {
    public int maxPathSum(TreeNode root) {
        if (root == null) return Integer.MIN_VALUE;
        int here = root.val + Math.max(0, down(root.left)) + Math.max(0, down(root.right));   // root as the top
        return Math.max(here, Math.max(maxPathSum(root.left), maxPathSum(root.right)));
    }

    private int down(TreeNode n) {                          // best downward path, recomputed each time
        if (n == null) return 0;
        return n.val + Math.max(0, Math.max(down(n.left), down(n.right)));
    }
}

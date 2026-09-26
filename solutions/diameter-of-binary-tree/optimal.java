class Solution {
    private int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return best;
    }

    private int height(TreeNode n) {
        if (n == null) return 0;
        int a = height(n.left), b = height(n.right);
        best = Math.max(best, a + b);                       // path bending at n
        return 1 + Math.max(a, b);                          // only one branch goes up
    }
}

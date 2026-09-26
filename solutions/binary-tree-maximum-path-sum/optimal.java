class Solution {
    private int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    private int gain(TreeNode n) {
        if (n == null) return 0;
        int a = Math.max(0, gain(n.left)), b = Math.max(0, gain(n.right));   // drop negative branches
        best = Math.max(best, n.val + a + b);               // path bending at n
        return n.val + Math.max(a, b);                      // one branch goes up
    }
}

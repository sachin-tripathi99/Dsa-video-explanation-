class Solution {
    public boolean isBalanced(TreeNode root) {
        return h(root) != -1;
    }

    private int h(TreeNode n) {                             // height, or -1 if unbalanced below
        if (n == null) return 0;
        int a = h(n.left);
        if (a == -1) return -1;
        int b = h(n.right);
        if (b == -1 || Math.abs(a - b) > 1) return -1;
        return 1 + Math.max(a, b);
    }
}

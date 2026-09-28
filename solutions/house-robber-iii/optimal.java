class Solution {
    public int rob(TreeNode root) {
        int[] r = solve(root);
        return Math.max(r[0], r[1]);
    }

    private int[] solve(TreeNode node) {                    // {rob, skip}
        if (node == null) return new int[]{0, 0};
        int[] l = solve(node.left), r = solve(node.right);
        return new int[]{node.val + l[1] + r[1], Math.max(l[0], l[1]) + Math.max(r[0], r[1])};
    }
}

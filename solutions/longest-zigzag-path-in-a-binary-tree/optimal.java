class Solution {
    private int best = 0;

    public int longestZigZag(TreeNode root) {
        solve(root);
        return best;
    }

    private int[] solve(TreeNode node) {                    // {start going left, start going right}
        if (node == null) return new int[]{-1, -1};
        int[] l = solve(node.left), r = solve(node.right);
        int[] res = {1 + l[1], 1 + r[0]};                   // the child must turn next
        best = Math.max(best, Math.max(res[0], res[1]));
        return res;
    }
}

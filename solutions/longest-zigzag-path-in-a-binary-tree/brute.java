class Solution {
    private int best = 0;

    public int longestZigZag(TreeNode root) {
        visit(root);
        return best;
    }

    private void visit(TreeNode node) {                     // start a walk at every node
        if (node == null) return;
        best = Math.max(best, Math.max(walk(node, true), walk(node, false)));
        visit(node.left);
        visit(node.right);
    }

    private int walk(TreeNode node, boolean goLeft) {
        int len = 0;
        while (true) {
            TreeNode next = goLeft ? node.left : node.right;
            if (next == null) return len;
            node = next;
            len++;
            goLeft = !goLeft;                               // switch direction
        }
    }
}

class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int through = height(root.left) + height(root.right);    // path bending here
        return Math.max(through, Math.max(diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right)));
    }

    private int height(TreeNode n) {                        // recomputed for every ancestor
        return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));
    }
}

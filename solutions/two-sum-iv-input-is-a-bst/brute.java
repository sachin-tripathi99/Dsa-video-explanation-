class Solution {
    private TreeNode root;

    public boolean findTarget(TreeNode root, int k) {
        this.root = root;
        return dfs(root, k);
    }

    private boolean dfs(TreeNode n, int k) {
        if (n == null) return false;
        TreeNode partner = find(root, k - n.val);           // BST search for the partner
        if (partner != null && partner != n) return true;
        return dfs(n.left, k) || dfs(n.right, k);
    }

    private TreeNode find(TreeNode n, int x) {
        while (n != null && n.val != x) n = x < n.val ? n.left : n.right;
        return n;
    }
}

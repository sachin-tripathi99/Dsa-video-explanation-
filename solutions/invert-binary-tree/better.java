class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            TreeNode t = n.left; n.left = n.right; n.right = t;   // swap
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        return root;
    }
}

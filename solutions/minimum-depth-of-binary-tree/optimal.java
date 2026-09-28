class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) return 0;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        for (int d = 1; ; d++) {
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                if (n.left == null && n.right == null) return d;   // first leaf = shallowest
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
        }
    }
}

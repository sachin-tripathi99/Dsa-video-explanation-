class Solution {
    public boolean isCousins(TreeNode root, int x, int y) {
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            boolean hasX = false, hasY = false;
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                if (n.val == x) hasX = true;
                if (n.val == y) hasY = true;
                if (n.left != null && n.right != null) {    // siblings are not cousins
                    int a = n.left.val, b = n.right.val;
                    if ((a == x && b == y) || (a == y && b == x)) return false;
                }
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            if (hasX && hasY) return true;
            if (hasX || hasY) return false;                 // different depths
        }
        return false;
    }
}

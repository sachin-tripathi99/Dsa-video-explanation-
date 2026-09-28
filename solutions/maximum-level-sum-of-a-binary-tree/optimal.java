class Solution {
    public int maxLevelSum(TreeNode root) {
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        long best = Long.MIN_VALUE;
        int ans = 1;
        for (int level = 1; !q.isEmpty(); level++) {
            long s = 0;
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                s += n.val;
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            if (s > best) { best = s; ans = level; }        // strict: smallest level on ties
        }
        return ans;
    }
}

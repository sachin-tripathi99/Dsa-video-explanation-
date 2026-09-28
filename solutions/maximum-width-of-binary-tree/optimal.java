class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        Deque<Object[]> q = new ArrayDeque<>();              // (node, position)
        q.offer(new Object[]{root, 0L});
        long best = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            long base = (long) q.peekFirst()[1], last = base;
            for (int i = 0; i < size; i++) {
                Object[] e = q.poll();
                TreeNode n = (TreeNode) e[0];
                long p = (long) e[1] - base;                // normalise to avoid overflow
                last = p;
                if (n.left != null) q.offer(new Object[]{n.left, 2 * p});
                if (n.right != null) q.offer(new Object[]{n.right, 2 * p + 1});
            }
            best = Math.max(best, last + 1);
        }
        return (int) best;
    }
}

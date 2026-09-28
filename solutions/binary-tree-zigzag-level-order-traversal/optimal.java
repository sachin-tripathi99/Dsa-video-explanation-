class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.offer(root);
        boolean leftToRight = true;
        while (!q.isEmpty()) {
            int size = q.size();
            Integer[] row = new Integer[size];
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                row[leftToRight ? i : size - 1 - i] = n.val;   // write in this level's direction
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            out.add(Arrays.asList(row));
            leftToRight = !leftToRight;
        }
        return out;
    }
}

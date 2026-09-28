class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> out = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            long sum = 0;                                   // 64-bit: values can be large
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                sum += n.val;
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            out.add((double) sum / size);
        }
        return out;
    }
}

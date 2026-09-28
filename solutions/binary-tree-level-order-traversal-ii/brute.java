class Solution {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        for (int d = height(root) - 1; d >= 0; d--) {       // deepest level first
            List<Integer> level = new ArrayList<>();
            collect(root, 0, d, level);                     // a full traversal per level
            out.add(level);
        }
        return out;
    }

    private int height(TreeNode n) { return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right)); }

    private void collect(TreeNode n, int depth, int target, List<Integer> level) {
        if (n == null) return;
        if (depth == target) { level.add(n.val); return; }
        collect(n.left, depth + 1, target, level);
        collect(n.right, depth + 1, target, level);
    }
}

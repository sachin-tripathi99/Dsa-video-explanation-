class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        List<TreeNode> level = new ArrayList<>();
        level.add(root);
        int best = 0;
        while (true) {
            int first = -1, last = -1;
            for (int i = 0; i < level.size(); i++) if (level.get(i) != null) { if (first < 0) first = i; last = i; }
            if (first < 0) return best;                     // no real nodes left
            best = Math.max(best, last - first + 1);
            List<TreeNode> next = new ArrayList<>();
            for (int i = first; i <= last; i++) {           // placeholders keep the gaps
                TreeNode n = level.get(i);
                next.add(n == null ? null : n.left);
                next.add(n == null ? null : n.right);
            }
            level = next;
        }
    }
}

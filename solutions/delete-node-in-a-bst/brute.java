class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        List<Integer> vals = new ArrayList<>();
        collect(root, key, vals);                           // sorted, without key
        return build(vals, 0, vals.size() - 1);
    }

    private void collect(TreeNode n, int key, List<Integer> out) {
        if (n == null) return;
        collect(n.left, key, out);
        if (n.val != key) out.add(n.val);
        collect(n.right, key, out);
    }

    private TreeNode build(List<Integer> v, int lo, int hi) {
        if (lo > hi) return null;
        int m = (lo + hi) >>> 1;
        TreeNode root = new TreeNode(v.get(m));
        root.left = build(v, lo, m - 1);
        root.right = build(v, m + 1, hi);
        return root;
    }
}

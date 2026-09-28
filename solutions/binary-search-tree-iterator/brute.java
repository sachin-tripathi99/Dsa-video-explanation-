class BSTIterator {
    private final List<Integer> vals = new ArrayList<>();
    private int i = 0;

    public BSTIterator(TreeNode root) { inorder(root); }    // flatten up front

    private void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        vals.add(n.val);
        inorder(n.right);
    }

    public int next() { return vals.get(i++); }

    public boolean hasNext() { return i < vals.size(); }
}

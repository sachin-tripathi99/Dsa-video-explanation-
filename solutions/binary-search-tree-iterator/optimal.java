class BSTIterator {
    private final Deque<TreeNode> st = new ArrayDeque<>();

    public BSTIterator(TreeNode root) { pushLeft(root); }

    private void pushLeft(TreeNode n) {
        while (n != null) { st.push(n); n = n.left; }       // the left spine
    }

    public int next() {
        TreeNode n = st.pop();                              // next smallest
        pushLeft(n.right);
        return n.val;
    }

    public boolean hasNext() { return !st.isEmpty(); }
}

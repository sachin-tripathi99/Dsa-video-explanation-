class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode node = root;
        while (true) {
            while (node != null) { st.push(node); node = node.left; }   // go far left
            node = st.pop();                                            // next smallest
            if (--k == 0) return node.val;
            node = node.right;
        }
    }
}

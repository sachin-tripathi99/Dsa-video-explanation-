class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        LinkedList<Integer> out = new LinkedList<>();
        if (root == null) return out;
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);
        while (!st.isEmpty()) {                             // node, right, left …
            TreeNode node = st.pop();
            out.addFirst(node.val);                         // … reversed while building
            if (node.left != null) st.push(node.left);
            if (node.right != null) st.push(node.right);
        }
        return out;
    }
}

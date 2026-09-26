class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);
        while (!st.isEmpty()) {
            TreeNode node = st.pop();
            out.add(node.val);
            if (node.right != null) st.push(node.right);    // right first,
            if (node.left != null) st.push(node.left);      // so left is popped first
        }
        return out;
    }
}

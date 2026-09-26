class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }   // go all the way left
            cur = st.pop();
            out.add(cur.val);                               // left side done: visit
            cur = cur.right;
        }
        return out;
    }
}

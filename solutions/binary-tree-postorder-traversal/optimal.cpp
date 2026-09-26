class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> out;
        if (!root) return out;
        stack<TreeNode*> st;
        st.push(root);
        while (!st.empty()) {                               // node, right, left …
            TreeNode* node = st.top(); st.pop();
            out.push_back(node->val);
            if (node->left) st.push(node->left);
            if (node->right) st.push(node->right);
        }
        reverse(out.begin(), out.end());                    // … reversed → left, right, node
        return out;
    }
};

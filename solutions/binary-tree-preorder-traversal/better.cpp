class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> out;
        if (!root) return out;
        stack<TreeNode*> st;
        st.push(root);
        while (!st.empty()) {
            TreeNode* node = st.top(); st.pop();
            out.push_back(node->val);
            if (node->right) st.push(node->right);          // right first,
            if (node->left) st.push(node->left);            // so left is popped first
        }
        return out;
    }
};

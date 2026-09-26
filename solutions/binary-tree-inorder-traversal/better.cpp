class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> out;
        stack<TreeNode*> st;
        TreeNode* cur = root;
        while (cur || !st.empty()) {
            while (cur) { st.push(cur); cur = cur->left; }  // go all the way left
            cur = st.top(); st.pop();
            out.push_back(cur->val);                        // left side done: visit
            cur = cur->right;
        }
        return out;
    }
};

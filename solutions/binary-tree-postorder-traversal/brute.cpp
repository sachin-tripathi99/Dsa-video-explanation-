class Solution {
    void dfs(TreeNode* node, vector<int>& out) {
        if (!node) return;
        dfs(node->left, out);                               // left
        dfs(node->right, out);                              // right
        out.push_back(node->val);                           // node
    }
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> out;
        dfs(root, out);
        return out;
    }
};

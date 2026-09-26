class Solution {
    void dfs(TreeNode* node, vector<int>& out) {
        if (!node) return;
        dfs(node->left, out);                               // left
        out.push_back(node->val);                           // node
        dfs(node->right, out);                              // right
    }
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> out;
        dfs(root, out);
        return out;
    }
};

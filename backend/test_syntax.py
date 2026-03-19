"""
Syntax and structure validation for Vibely backend
Tests code quality without requiring dependencies
"""

import ast
import sys
from pathlib import Path


def test_python_syntax(file_path):
    """Test if a Python file has valid syntax"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse the AST to check syntax
        ast.parse(content)
        return True, None
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Error reading file: {e}"


def test_all_python_files():
    """Test syntax of all Python files in the project"""
    print("🧪 Testing Python syntax for all files...")
    
    # Find all Python files
    python_files = []
    for pattern in ["**/*.py"]:
        python_files.extend(Path(".").glob(pattern))
    
    results = []
    
    for file_path in python_files:
        if file_path.name.startswith('.'):
            continue
            
        success, error = test_python_syntax(file_path)
        results.append((str(file_path), success, error))
        
        if success:
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path}: {error}")
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    print(f"\n📊 Syntax Results: {passed}/{total} files passed")
    return passed == total


def test_project_structure():
    """Test that all required files and directories exist"""
    print("\n🧪 Testing project structure...")
    
    required_files = [
        "main.py",
        "requirements.txt",
        "Dockerfile",
        "docker-compose.yml",
        ".env.example",
        "app/__init__.py",
        "app/core/config.py",
        "app/core/database.py",
        "app/core/security.py",
        "app/models/user.py",
        "app/models/post.py",
        "app/services/auth.py",
        "app/services/vibe_engine.py",
        "app/api/routes/auth.py",
        "app/api/routes/feed.py",
        "app/workers/celery_app.py",
        "app/sockets/websocket_manager.py"
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"\n❌ Missing files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    
    print(f"\n✅ All {len(required_files)} required files present!")
    return True


def test_import_structure():
    """Test that import statements are properly structured"""
    print("\n🧪 Testing import structure...")
    
    # Key files to check imports
    key_files = [
        "main.py",
        "app/core/config.py",
        "app/services/auth.py",
        "app/api/routes/auth.py"
    ]
    
    for file_path in key_files:
        if not Path(file_path).exists():
            continue
            
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Parse AST and check imports
            tree = ast.parse(content)
            
            imports = []
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    module = node.module or ""
                    for alias in node.names:
                        imports.append(f"{module}.{alias.name}")
            
            print(f"✅ {file_path}: {len(imports)} imports found")
            
        except Exception as e:
            print(f"❌ {file_path}: Error parsing imports - {e}")
            return False
    
    return True


def test_configuration_structure():
    """Test configuration file structure"""
    print("\n🧪 Testing configuration structure...")
    
    try:
        # Check .env.example exists and has required keys
        env_example = Path(".env.example")
        if env_example.exists():
            content = env_example.read_text()
            
            required_keys = [
                "DATABASE_URL",
                "SECRET_KEY", 
                "REDIS_URL",
                "HUGGINGFACE_MODEL"
            ]
            
            for key in required_keys:
                if key in content:
                    print(f"✅ {key} found in .env.example")
                else:
                    print(f"❌ {key} missing from .env.example")
                    return False
        
        # Check requirements.txt has key dependencies
        req_file = Path("requirements.txt")
        if req_file.exists():
            content = req_file.read_text()
            
            required_deps = [
                "fastapi",
                "sqlalchemy", 
                "redis",
                "celery",
                "transformers"
            ]
            
            for dep in required_deps:
                if dep in content.lower():
                    print(f"✅ {dep} found in requirements.txt")
                else:
                    print(f"❌ {dep} missing from requirements.txt")
                    return False
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration test error: {e}")
        return False


def test_api_route_structure():
    """Test API route file structure"""
    print("\n🧪 Testing API route structure...")
    
    route_files = [
        "app/api/routes/auth.py",
        "app/api/routes/feed.py", 
        "app/api/routes/user.py",
        "app/api/routes/vibe.py"
    ]
    
    for route_file in route_files:
        if not Path(route_file).exists():
            print(f"❌ {route_file} missing")
            return False
            
        try:
            with open(route_file, 'r') as f:
                content = f.read()
            
            # Check for router definition
            if "router = APIRouter()" in content:
                print(f"✅ {route_file}: Router defined")
            else:
                print(f"❌ {route_file}: No router found")
                return False
                
            # Check for route decorators
            if "@router." in content:
                print(f"✅ {route_file}: Routes defined")
            else:
                print(f"❌ {route_file}: No routes found")
                return False
                
        except Exception as e:
            print(f"❌ {route_file}: Error - {e}")
            return False
    
    return True


def main():
    """Run all validation tests"""
    print("🚀 Vibely Backend Structure & Syntax Validation")
    print("=" * 60)
    
    tests = [
        ("Project Structure", test_project_structure),
        ("Python Syntax", test_all_python_files),
        ("Import Structure", test_import_structure),
        ("Configuration", test_configuration_structure),
        ("API Routes", test_api_route_structure),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL VALIDATION TESTS PASSED!")
        print("✨ Backend structure and syntax are correct!")
        print("\n📋 Next Steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Set up PostgreSQL and Redis")
        print("3. Run: docker-compose up -d")
        print("4. Access API: http://localhost:8000/docs")
    else:
        print(f"\n⚠️  {total - passed} validation tests failed.")
        print("Please fix the issues above before proceeding.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
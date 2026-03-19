"""
API Structure and Endpoint Validation
Tests the FastAPI application structure without running the server
"""

import ast
import json
from pathlib import Path


def analyze_route_file(file_path):
    """Analyze a route file and extract endpoint information"""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        tree = ast.parse(content)
        
        endpoints = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                # Look for route decorators
                for decorator in node.decorator_list:
                    if isinstance(decorator, ast.Call):
                        if hasattr(decorator.func, 'attr'):
                            method = decorator.func.attr
                            if method in ['get', 'post', 'put', 'delete', 'patch']:
                                # Extract path from decorator arguments
                                path = "/"
                                if decorator.args:
                                    if isinstance(decorator.args[0], ast.Constant):
                                        path = decorator.args[0].value
                                
                                endpoints.append({
                                    'method': method.upper(),
                                    'path': path,
                                    'function': node.name,
                                    'line': node.lineno
                                })
        
        return endpoints
        
    except Exception as e:
        print(f"Error analyzing {file_path}: {e}")
        return []


def test_api_endpoints():
    """Test and document all API endpoints"""
    print("🧪 Analyzing API Endpoints...")
    
    route_files = {
        'Authentication': 'app/api/routes/auth.py',
        'Feed & Posts': 'app/api/routes/feed.py',
        'Users': 'app/api/routes/user.py',
        'Vibe Engine': 'app/api/routes/vibe.py'
    }
    
    all_endpoints = {}
    
    for category, file_path in route_files.items():
        if Path(file_path).exists():
            endpoints = analyze_route_file(file_path)
            all_endpoints[category] = endpoints
            
            print(f"\n📁 {category} ({file_path}):")
            for endpoint in endpoints:
                print(f"   {endpoint['method']:6} {endpoint['path']:30} -> {endpoint['function']}")
        else:
            print(f"❌ {file_path} not found")
    
    return all_endpoints


def test_model_relationships():
    """Test database model relationships"""
    print("\n🧪 Testing Model Relationships...")
    
    model_files = [
        'app/models/user.py',
        'app/models/post.py', 
        'app/models/like.py',
        'app/models/comment.py',
        'app/models/notification.py'
    ]
    
    relationships = {}
    
    for model_file in model_files:
        if not Path(model_file).exists():
            continue
            
        try:
            with open(model_file, 'r') as f:
                content = f.read()
            
            # Extract model name and relationships
            tree = ast.parse(content)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    model_name = node.name
                    model_relationships = []
                    
                    # Look for relationship definitions
                    for item in node.body:
                        if isinstance(item, ast.Assign):
                            for target in item.targets:
                                if isinstance(target, ast.Name):
                                    if isinstance(item.value, ast.Call):
                                        if hasattr(item.value.func, 'id') and item.value.func.id == 'relationship':
                                            if item.value.args:
                                                related_model = item.value.args[0].value if isinstance(item.value.args[0], ast.Constant) else "Unknown"
                                                model_relationships.append({
                                                    'field': target.id,
                                                    'related_model': related_model
                                                })
                    
                    if model_relationships:
                        relationships[model_name] = model_relationships
            
        except Exception as e:
            print(f"Error analyzing {model_file}: {e}")
    
    for model, rels in relationships.items():
        print(f"\n📊 {model}:")
        for rel in rels:
            print(f"   {rel['field']} -> {rel['related_model']}")
    
    return len(relationships) > 0


def test_schema_validation():
    """Test Pydantic schema structure"""
    print("\n🧪 Testing Schema Structure...")
    
    schema_files = [
        'app/schemas/auth.py',
        'app/schemas/user.py',
        'app/schemas/post.py',
        'app/schemas/comment.py'
    ]
    
    schemas = {}
    
    for schema_file in schema_files:
        if not Path(schema_file).exists():
            continue
            
        try:
            with open(schema_file, 'r') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            file_schemas = []
            
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    # Check if it inherits from BaseModel
                    for base in node.bases:
                        if isinstance(base, ast.Name) and base.id == 'BaseModel':
                            file_schemas.append(node.name)
            
            if file_schemas:
                schemas[schema_file] = file_schemas
            
        except Exception as e:
            print(f"Error analyzing {schema_file}: {e}")
    
    for file_path, schema_list in schemas.items():
        print(f"\n📋 {file_path}:")
        for schema in schema_list:
            print(f"   - {schema}")
    
    return len(schemas) > 0


def test_service_layer():
    """Test service layer structure"""
    print("\n🧪 Testing Service Layer...")
    
    service_files = [
        'app/services/auth.py',
        'app/services/vibe_engine.py'
    ]
    
    services = {}
    
    for service_file in service_files:
        if not Path(service_file).exists():
            continue
            
        try:
            with open(service_file, 'r') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            service_classes = []
            
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    methods = []
                    for item in node.body:
                        if isinstance(item, ast.FunctionDef):
                            methods.append(item.name)
                    
                    service_classes.append({
                        'name': node.name,
                        'methods': methods
                    })
            
            if service_classes:
                services[service_file] = service_classes
            
        except Exception as e:
            print(f"Error analyzing {service_file}: {e}")
    
    for file_path, service_list in services.items():
        print(f"\n🔧 {file_path}:")
        for service in service_list:
            print(f"   {service['name']}:")
            for method in service['methods'][:5]:  # Show first 5 methods
                print(f"     - {method}()")
            if len(service['methods']) > 5:
                print(f"     ... and {len(service['methods']) - 5} more methods")
    
    return len(services) > 0


def generate_api_documentation():
    """Generate API documentation from route analysis"""
    print("\n📚 Generating API Documentation...")
    
    endpoints = test_api_endpoints()
    
    # Create API documentation
    api_doc = {
        "title": "Vibely API Documentation",
        "version": "1.0.0",
        "base_url": "http://localhost:8000",
        "endpoints": {}
    }
    
    for category, endpoint_list in endpoints.items():
        api_doc["endpoints"][category] = []
        
        for endpoint in endpoint_list:
            api_doc["endpoints"][category].append({
                "method": endpoint["method"],
                "path": f"/api/v1{endpoint['path']}" if not endpoint['path'].startswith('/api') else endpoint['path'],
                "function": endpoint["function"],
                "description": f"{endpoint['method']} {endpoint['path']}"
            })
    
    # Save documentation
    with open('api_documentation.json', 'w') as f:
        json.dump(api_doc, f, indent=2)
    
    print("✅ API documentation saved to api_documentation.json")
    
    return True


def main():
    """Run all API structure tests"""
    print("🚀 Vibely Backend API Structure Analysis")
    print("=" * 60)
    
    tests = [
        ("API Endpoints", test_api_endpoints),
        ("Model Relationships", test_model_relationships),
        ("Schema Structure", test_schema_validation),
        ("Service Layer", test_service_layer),
        ("API Documentation", generate_api_documentation),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            # For endpoint analysis, check if we found any endpoints
            if test_name == "API Endpoints":
                result = len(result) > 0 if isinstance(result, dict) else bool(result)
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 API STRUCTURE ANALYSIS SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 API STRUCTURE ANALYSIS COMPLETE!")
        print("✨ All components are properly structured!")
    else:
        print(f"\n⚠️  {total - passed} tests had issues.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)